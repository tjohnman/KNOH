#!/bin/perl

use MIME::Base64 qw(encode_base64 decode_base64);
use IO::Uncompress::AnyInflate qw(anyinflate $AnyInflateError);


while (<*.b64>) {
    my $input = $_;
    my $output = substr($input, 0, -3).'bin';
    my $b64buf;

    open(INFILE, $input) or die "$!";
    while (<INFILE>) {
        s/^\W*(.+)\W*$/$1/g; # trim
        if ($_ !~ /^(MIME-Version|Content-(Type|(Transfer-)?Encoding|Disposition)): .+/) {
            $b64buf .= $_;
        }
    }
    close INFILE;
    #print $b64buf.$/;
    my $compressed = decode_base64($b64buf);
    my $uncompressed;

    print "decompressing $input...$/";
    my $z = new IO::Uncompress::AnyInflate \$compressed or die "AnyInflate failed: $AnyInflateError$/";

    my $hdr = $z->getHeaderInfo();
    my $trailerLength = undef;
    my $trailer;
    while (($k, $v) = each %$hdr) {
        if ($k eq "TrailerLength") {
            $trailerLength = $v;
        }
        print "  ".$k." = ".$v.$/;
    }
    die "missing header field TrailerLength" unless defined $trailerLength;
    if ($trailerLength > 0) {
        $trailer = substr($compressed, -$trailerLength, $trailerLength, '');
        printf("  Trailer (0x): %*v02X$/", " ", $trailer);
    }
    anyinflate \$compressed => \$uncompressed or die "anyinflate failed: $AnyInflateError".$/;
    printf("  compressed length: %d$/", length($compressed));
    printf("  uncompressed length: %d$/", length($uncompressed));
    anyinflate \$compressed => $output;

    @chunks = split(/\x09\x59\x01/, $uncompressed);
    printf("  %d chunks$/", scalar @chunks);
    print $/;
}
